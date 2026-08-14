# Ratified Plan: CISEM-IP-20260810-FRONTEND-PLAYBOOK-REFACTOR
# Architectural Reasoning: Implements FastAPI routes for Priority Engine & Parking Vault.
# Reads/writes priority metrics to parking_vault_draft.yaml dynamically using Twelve-Factor environment variable.
# Validates signed tenant contexts via verify_tenant_context_py to enforce access controls.
# Parent Principles: GEMINI.md Rule 1, Rule 2, Rule 16, Rule 17.

import os
import yaml
from typing import List, Optional
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/v1/parking-vault",
    tags=["Priority Engine & Parking Vault"]
)

# Helper to verify tenant context and assert role is admin or developer
def check_admin_access(request: Request):
    from .main import verify_tenant_context_py
    context = verify_tenant_context_py(request)
    roles = context.get("roles", [])
    if "admin" not in roles and "developer" not in roles:
        raise HTTPException(status_code=403, detail="Forbidden: Admin or Developer role required.")
    return context

# Schema for updating priority metrics
class PriorityUpdateRequest(BaseModel):
    item_id: str
    scope: int
    complexity: int
    completion_needed: str
    urgency: int
    blast_radius: int
    significance: int

def get_parking_vault_path() -> str:
    path = os.getenv("PARKING_VAULT_PATH", "cisem_core/sandbox/parking_vault_draft.yaml")
    # Resolve relative to workspace root if needed
    if not os.path.isabs(path):
        # Go up two folders from backend/src/backend/ to get workspace root
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
        full_path = os.path.join(base_dir, path)
        if os.path.exists(full_path):
            return full_path
    return os.path.abspath(path)

def calculate_score(item: dict) -> float:
    # priority_score = (urgency * 0.3) + (significance * 0.3) + (blast_radius * 0.2) + (complexity * 0.1) + (scope * 0.1)
    urgency = float(item.get("urgency", 5))
    significance = float(item.get("significance", 5))
    blast_radius = float(item.get("blast_radius", 5))
    complexity = float(item.get("complexity", 5))
    scope = float(item.get("scope", 5))
    
    score = (urgency * 0.3) + (significance * 0.3) + (blast_radius * 0.2) + (complexity * 0.1) + (scope * 0.1)
    return round(score, 2)

@router.get("")
def get_parking_items(request: Request):
    # Public view allowed, but check tenant context if present
    path = get_parking_vault_path()
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail=f"Parking Vault file not found at: {path}")
        
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f) or {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading Parking Vault: {str(e)}")
        
    items = data.get("parked_items", [])
    for item in items:
        # Populate defaults if missing
        if "scope" not in item:
            item["scope"] = 5
        if "complexity" not in item:
            item["complexity"] = 5
        if "completion_needed" not in item:
            item["completion_needed"] = "TBD"
        if "urgency" not in item:
            item["urgency"] = 5
        if "blast_radius" not in item:
            item["blast_radius"] = 5
        if "significance" not in item:
            item["significance"] = 5
        item["priority_score"] = calculate_score(item)
        
    # Sort by priority score descending
    items.sort(key=lambda x: x.get("priority_score", 0.0), reverse=True)
    return {"parked_items": items}

@router.post("/prioritize")
def update_priority(request: Request, payload: PriorityUpdateRequest):
    # Enforce role guard
    check_admin_access(request)
    
    path = get_parking_vault_path()
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail=f"Parking Vault file not found at: {path}")
        
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f) or {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading Parking Vault: {str(e)}")
        
    items = data.get("parked_items", [])
    found = False
    for item in items:
        if item.get("item_id") == payload.item_id:
            item["scope"] = payload.scope
            item["complexity"] = payload.complexity
            item["completion_needed"] = payload.completion_needed
            item["urgency"] = payload.urgency
            item["blast_radius"] = payload.blast_radius
            item["significance"] = payload.significance
            item["priority_score"] = calculate_score(item)
            found = True
            break
            
    if not found:
        raise HTTPException(status_code=404, detail=f"Item {payload.item_id} not found in Parking Vault.")
        
    try:
        with open(path, "w", encoding="utf-8") as f:
            yaml.safe_dump(data, f, allow_unicode=True, sort_keys=False)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error writing Parking Vault: {str(e)}")
        
    # Re-sort and return
    for item in items:
        if "priority_score" not in item:
            item["priority_score"] = calculate_score(item)
    items.sort(key=lambda x: x.get("priority_score", 0.0), reverse=True)
    
    return {"success": True, "parked_items": items}
