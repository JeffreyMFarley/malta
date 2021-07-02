variable "name" {
  type        = string
  description = "The name of the service"
}

variable "repository_name" {
  type        = string
  description = "The name of the image repo to use"
}

variable "repository_url" {
  type        = string
  description = "The URL of the image to use"
}

variable "source_bucket_id" {
  type        = string
  description = "The id of the source bucket"
}

variable "target_bucket_id" {
  type        = string
  description = "The id of the target bucket"
}
