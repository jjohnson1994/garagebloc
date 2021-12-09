resource "aws_s3_bucket" "deploy" {
  bucket = var.domain_name
  acl    = "public-read"

  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "aws_s3_bucket_policy" "deploy" {
  bucket = aws_s3_bucket.deploy.id

  policy = <<POLICY
{ 
  "Version": "2012-10-17",
  "Statement": [
      {
          "Sid": "PublicReadGetObject",
          "Effect": "Allow",
          "Principal": "*",
          "Action": [
              "s3:GetObject"
          ],
          "Resource": [
            "arn:aws:s3:::${var.domain_name}/*"
          ]
      }
  ]
}
POLICY
}
