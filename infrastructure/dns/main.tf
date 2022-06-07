locals {
  zone_id          = "63e0c4e8461fe6f7acd680c3a2c8ba9d"
  domain           = "jkomskis.com"
  www_record_name  = "www${terraform.workspace == "prod" ? "" : "-${terraform.workspace}"}"
  www_cdn_endpoint = "${local.www_record_name}-jkomskis.azureedge.net"
}

resource "cloudflare_record" "www" {
  zone_id = local.zone_id
  name    = local.www_record_name
  value   = local.www_cdn_endpoint
  type    = "CNAME"
  proxied = true
  provisioner "local-exec" {
    interpreter = ["/bin/bash", "-c"]
    command     = "../wait_for_dns.sh ${cloudflare_record.www.name}.${local.domain}"
  }
}

resource "cloudflare_record" "cdnverify-www" {
  zone_id = local.zone_id
  name    = "cdnverify.${local.www_record_name}"
  value   = "cdnverify.${local.www_cdn_endpoint}"
  type    = "CNAME"
  proxied = false
  provisioner "local-exec" {
    interpreter = ["/bin/bash", "-c"]
    command     = "../wait_for_dns.sh ${cloudflare_record.cdnverify-www.name}.${local.domain}"
  }
}
