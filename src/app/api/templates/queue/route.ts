import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/*
# CISEM CODE HEADER > MANDATORY
# ratified_plan: CISEM-IP-20260811-TEMPLATE-SYNC-ENGINE
# governor_signature: GOV-YARIV-20260811-TEMPLATE-SYNC-ENGINE-V1.0
# version: V1.0
# reasoning: |
#   API to enqueue page updates for scheduled propagation at local 02:00 AM.
#   Validates timezone offset, checks for MAJOR breaking change ratification files,
#   and prevents race conditions using write-locks.
#   Parent principles: AxiomsAndPrinciples V1.29 >AX-100000, >PR-102000, >PR-103000.
*/

const QUEUE_PATH = path.join(process.cwd(), 'cisem_core', 'template_sync_queue.json');
const REGISTRY_PATH = path.join(process.cwd(), 'cisem_core', 'templates_registry.json');
const LOCK_PATH = path.join(process.cwd(), 'cisem_core', 'template_sync_queue.lock');

function acquireLock(): boolean {
  if (fs.existsSync(LOCK_PATH)) {
    const stats = fs.statSync(LOCK_PATH);
    const ageMs = Date.now() - stats.mtimeMs;
    if (ageMs < 10000) { // 10 second timeout
      return false;
    }
  }
  fs.writeFileSync(LOCK_PATH, String(Date.now()), 'utf-8');
  return true;
}

function releaseLock() {
  if (fs.existsSync(LOCK_PATH)) {
    fs.unlinkSync(LOCK_PATH);
  }
}

// Compute the next UTC timestamp corresponding to local 02:00 AM for the given timezone offset
function computeNextTwoAM(timezoneName: string): Date {
  const now = new Date();
  
  // Simple offset computation logic for timezone simulation
  let tzOffsetHours = 2; // Default to Asia/Jerusalem (UTC+2 / UTC+3)
  if (timezoneName === 'America/New_York') {
    tzOffsetHours = -4; // Eastern Daylight Time (UTC-4)
  }

  // Create date in local timezone context
  const localTime = new Date(now.getTime() + tzOffsetHours * 60 * 60 * 1000);
  const targetLocal = new Date(localTime);
  targetLocal.setHours(2, 0, 0, 0);

  if (targetLocal.getTime() <= localTime.getTime()) {
    // If 02:00 AM already passed today, target tomorrow's 02:00 AM
    targetLocal.setDate(targetLocal.getDate() + 1);
  }

  // Convert target back to UTC
  return new Date(targetLocal.getTime() - tzOffsetHours * 60 * 60 * 1000);
}

export async function POST(req: NextRequest) {
  if (!acquireLock()) {
    return NextResponse.json({ error: 'Queue file currently locked by another operation.' }, { status: 423 });
  }

  try {
    const body = await req.json();
    const { pageId, templateId, fromVersion, toVersion, changeType } = body;

    if (!pageId || !templateId || !fromVersion || !toVersion || !changeType) {
      releaseLock();
      return NextResponse.json(
        { error: 'Missing required parameters: pageId, templateId, fromVersion, toVersion, changeType' },
        { status: 400 }
      );
    }

    // Read registry to get client page details (e.g. timezone)
    const registryRaw = fs.readFileSync(REGISTRY_PATH, 'utf-8');
    const registry = JSON.parse(registryRaw);
    const page = (registry.instantiated_pages || []).find((p: any) => p.id === pageId);

    if (!page) {
      releaseLock();
      return NextResponse.json({ error: `Instantiated page '${pageId}' not found.` }, { status: 404 });
    }

    // Guard: Enforce Governor signature ratification for MAJOR updates
    if (changeType === 'MAJOR') {
      const ratificationFile = path.join(
        process.cwd(),
        'cisem_core',
        'planning',
        `${pageId}__governor_ratification.json`
      );
      if (!fs.existsSync(ratificationFile)) {
        releaseLock();
        return NextResponse.json(
          { error: `MAJOR template update blocked. Requires governor ratification file: ${path.basename(ratificationFile)}` },
          { status: 403 }
        );
      }
    }

    const timezone = page.update_policy?.timezone || 'Asia/Jerusalem';
    const scheduledUtc = computeNextTwoAM(timezone);

    // Read current queue
    const queueRaw = fs.readFileSync(QUEUE_PATH, 'utf-8');
    const queue = JSON.parse(queueRaw);

    // Prevent duplicate pending entries for the same page
    const existingIndex = queue.findIndex((item: any) => item.page_id === pageId && item.status === 'pending');
    const newEntry = {
      page_id: pageId,
      template_id: templateId,
      from_version: fromVersion,
      to_version: toVersion,
      change_type: changeType,
      scheduled_utc: scheduledUtc.toISOString(),
      timezone,
      status: 'pending',
      queued_at: new Date().toISOString()
    };

    if (existingIndex > -1) {
      queue[existingIndex] = newEntry;
    } else {
      queue.push(newEntry);
    }

    fs.writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2), 'utf-8');
    releaseLock();

    return NextResponse.json({
      success: true,
      message: `Successfully enqueued page update. Scheduled UTC: ${scheduledUtc.toISOString()}`,
      job: newEntry
    });
  } catch (err: unknown) {
    releaseLock();
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Server error: ${message}` }, { status: 500 });
  }
}
