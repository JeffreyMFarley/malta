# -----------------------------------------------------------------------------
# Shared Resources
# -----------------------------------------------------------------------------

module "image_repo" {
  for_each = toset(["to_text", "to_corpus"])
  source   = "./ecr"
  name     = lower("${var.name}_${each.key}")
}

module "buckets" {
  for_each = toset(["intake", "lake", "corpus"])
  source   = "./bucket"
  name     = lower("${var.name}-${each.key}")
}

# -----------------------------------------------------------------------------
# Individual services / applications
# -----------------------------------------------------------------------------

module "to_text" {
  source = "./s3-trigger-lambda"

  name             = "${var.name}-to-text"
  repository_name  = module.image_repo["to_text"].name
  repository_url   = module.image_repo["to_text"].repo_url
  source_bucket_id = module.buckets["intake"].id
  target_bucket_id = module.buckets["lake"].id
}

module "to_corpus" {
  source = "./s3-trigger-lambda"

  name             = "${var.name}-to-corpus"
  repository_name  = module.image_repo["to_corpus"].name
  repository_url   = module.image_repo["to_corpus"].repo_url
  source_bucket_id = module.buckets["lake"].id
  target_bucket_id = module.buckets["corpus"].id
}
