variable "name" {
  type        = string
  description = "The name of the service"
}

variable "timeout" {
  type        = number
  default     = 180
  description = "The number of seconds before timing out"
}

variable "memory_size" {
  type        = number
  default     = 2000
  description = "The MB of maximum memory"
}

###############################################################################
# ECR

variable "repository_name" {
  type        = string
  description = "The name of the image repo to use"
}

variable "repository_url" {
  type        = string
  description = "The URL of the image to use"
}

###############################################################################
# S3

variable "source_bucket_id" {
  type        = string
  description = "The id of the source bucket"
}

variable "target_bucket_id" {
  type        = string
  description = "The id of the target bucket"
}
