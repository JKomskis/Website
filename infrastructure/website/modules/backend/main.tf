locals {
  domain            = "jkomskis.com"
  function_app_name = "jkomskis${terraform.workspace == "prod" ? "" : "-${terraform.workspace}"}"
}

resource "azurerm_service_plan" "this" {
  name                = var.resource_code
  resource_group_name = var.resource_group
  location            = var.location
  os_type             = "Linux"
  sku_name            = "Y1"
}

resource "azurerm_cognitive_account" "translate" {
  name                = "jkomskis-language-garbler${terraform.workspace == "prod" ? "" : "-${terraform.workspace}"}"
  location            = var.location
  resource_group_name = var.resource_group
  kind                = "TextTranslation"

  sku_name = "F0"
}

resource "azurerm_application_insights" "this" {
  name                = "function-app-insights"
  location            = var.location
  resource_group_name = var.resource_group
  application_type    = "Node.JS"
}

resource "azurerm_linux_function_app" "this" {
  name                = local.function_app_name
  resource_group_name = var.resource_group
  location            = var.location

  storage_account_name = var.storage_account_name
  service_plan_id      = azurerm_service_plan.this.id

  site_config {}
  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME"       = "node"
    "AZ_TRANSLATE_SECRET_KEY"        = azurerm_cognitive_account.translate.primary_access_key
    "AzureWebJobsStorage"            = var.storage_account_connection_string
    "APPINSIGHTS_INSTRUMENTATIONKEY" = azurerm_application_insights.this.instrumentation_key
  }
}


