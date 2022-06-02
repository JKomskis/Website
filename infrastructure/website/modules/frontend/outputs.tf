output "storage_account_name" {
  value = azurerm_storage_account.this.name
}

output "storage_account_endpoint" {
  value = azurerm_storage_account.this.primary_web_endpoint
}
