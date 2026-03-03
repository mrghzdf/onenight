import { countById } from "./gameHelpers"

export function canAddRole(selectedRoles, id, roleMaxCopies) {
  return countById(selectedRoles, id) < (roleMaxCopies[id] ?? 1)
}

export function addRoleSelection(selectedRoles, id, roleMaxCopies) {
  const currentCount = countById(selectedRoles, id)
  const maxCount = roleMaxCopies[id] ?? 1
  if (currentCount >= maxCount) {
    return selectedRoles
  }
  return [...selectedRoles, id]
}

export function removeRoleSelection(selectedRoles, id) {
  let removed = false
  return selectedRoles.filter((roleId) => {
    if (!removed && roleId === id) {
      removed = true
      return false
    }
    return true
  })
}

export function toggleRoleSelection(selectedRoles, id) {
  const currentCount = countById(selectedRoles, id)
  if (currentCount === 0) {
    return [...selectedRoles, id]
  }
  return selectedRoles.filter((roleId) => roleId !== id)
}
