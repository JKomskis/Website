resource "azurerm_resource_group" "this" {
  name     = var.resource_group
  location = var.location
}

module "frontend" {
  source         = "./modules/frontend"
  resource_group = var.resource_group
  location       = var.location
}
