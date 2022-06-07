locals {
  zone_id         = "63e0c4e8461fe6f7acd680c3a2c8ba9d"
  domain          = "jkomskis.com"
  cdn_record_name = "cdn2"
  cdn_endpoint    = "${local.cdn_record_name}-jkomskis.azureedge.net"
}

resource "cloudflare_record" "cdn" {
  zone_id = local.zone_id
  name    = local.cdn_record_name
  value   = local.cdn_endpoint
  type    = "CNAME"
  proxied = true
  provisioner "local-exec" {
    interpreter = ["/bin/bash", "-c"]
    command     = "../wait_for_dns.sh ${cloudflare_record.cdn.name}.${local.domain}"
  }
}

resource "cloudflare_record" "cdnverify-cdn" {
  zone_id = local.zone_id
  name    = "cdnverify.${local.cdn_record_name}"
  value   = "cdnverify.${local.cdn_endpoint}"
  type    = "CNAME"
  proxied = false
  provisioner "local-exec" {
    interpreter = ["/bin/bash", "-c"]
    command     = "../wait_for_dns.sh ${cloudflare_record.cdnverify-cdn.name}.${local.domain}"
  }
}
