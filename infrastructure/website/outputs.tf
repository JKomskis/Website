output "resource_group" {
  value = local.resource_group
}

output "storage_account_name" {
  value = module.frontend.storage_account_name
}
