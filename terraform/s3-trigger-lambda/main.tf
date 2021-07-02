###############################################################################
# Source Image

data "aws_ecr_image" "service_image" {
  repository_name = var.repository_name
  image_tag       = "latest"
}

###############################################################################
# Lambda Function Definition

resource "aws_lambda_function" "main" {
   function_name = var.name
   image_uri     = "${var.repository_url}:latest"
   role          = aws_iam_role.main.arn
   package_type  = "Image"

   environment {
     variables = {
      TARGET_BUCKET = var.target_bucket_id 
     }
   }

   depends_on = [data.aws_ecr_image.service_image]
}

###############################################################################
# S3 Trigger

resource "aws_s3_bucket_notification" "lambda-trigger" {
  bucket = var.source_bucket_id
  lambda_function {
    lambda_function_arn = "${aws_lambda_function.main.arn}"
    events              = ["s3:ObjectCreated:*"]
  }
}

resource "aws_lambda_permission" "s3" {
   statement_id  = "AllowS3Invoke"
   action        = "lambda:InvokeFunction"
   function_name = aws_lambda_function.main.function_name
   principal     = "s3.amazonaws.com"
   source_arn    = "arn:aws:s3:::${var.source_bucket_id}"
}

###############################################################################
# Logging

resource "aws_cloudwatch_log_group" "main" {
  name              = "/aws/lambda/${var.name}"
  retention_in_days = 30
}

###############################################################################
# IAM

resource "aws_iam_role" "main" {
   name = "${var.name}-role"

   assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF

}

resource "aws_iam_policy" "main" {
  name        = "${var.name}-policy"
  path        = "/"
  description = "IAM policy for ${var.name}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    },
    {
      "Action": [
        "s3:*"
      ],
      "Resource": "*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.main.name
  policy_arn = aws_iam_policy.main.arn
}
