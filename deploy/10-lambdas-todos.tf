
# get todos lambda
data "archive_file" "get_todos_zip" {
  type        = "zip"
  source_file = "lambdas/getTodos.js"
  output_path = "lambdas/getTodos.zip"
}

resource "aws_lambda_function" "get_todos" {
  function_name    = "GetTodos"
  filename         = data.archive_file.get_todos_zip.output_path
  source_code_hash = data.archive_file.get_todos_zip.output_base64sha256
  handler          = "getTodos.handler"
  runtime          = "nodejs16.x"
  role             = aws_iam_role.lambda_exec.arn
}

# get todo by ID lambda
data "archive_file" "get_todo_by_id_zip" {
  type        = "zip"
  source_file = "lambdas/getTodoById.js"
  output_path = "lambdas/getTodoById.zip"
}

resource "aws_lambda_function" "get_todo_by_id" {
  function_name    = "GetTodoById"
  filename         = data.archive_file.get_todo_by_id_zip.output_path
  source_code_hash = data.archive_file.get_todo_by_id_zip.output_base64sha256
  handler          = "getTodoById.handler"
  runtime          = "nodejs16.x"
  role             = aws_iam_role.lambda_exec.arn
}

data "archive_file" "update_todo_by_id_zip" {
  type        = "zip"
  source_file = "lambdas/updateTodoById.js"
  output_path = "lambdas/updateTodoById.zip"
}

resource "aws_lambda_function" "update_todo_by_id" {
  function_name    = "UpdateTodoById"
  filename         = data.archive_file.update_todo_by_id_zip.output_path
  source_code_hash = data.archive_file.update_todo_by_id_zip.output_base64sha256
  handler          = "updateTodoById.handler"
  runtime          = "nodejs16.x"
  role             = aws_iam_role.lambda_exec.arn
}

data "archive_file" "delete_todo_by_id_zip" {
  type        = "zip"
  source_file = "lambdas/deleteTodoById.js"
  output_path = "lambdas/deleteTodoById.zip"
}

resource "aws_lambda_function" "delete_todo_by_id" {
  function_name    = "DeleteTodoById"
  filename         = data.archive_file.delete_todo_by_id_zip.output_path
  source_code_hash = data.archive_file.delete_todo_by_id_zip.output_base64sha256
  handler          = "deleteTodoById.handler"
  runtime          = "nodejs16.x"
  role             = aws_iam_role.lambda_exec.arn
}

data "archive_file" "create_todo_zip" {
  type        = "zip"
  source_file = "lambdas/createTodo.js"
  output_path = "lambdas/createTodo.zip"
}

resource "aws_lambda_function" "create_todo" {
  function_name    = "CreateTodo"
  filename         = data.archive_file.create_todo_zip.output_path
  source_code_hash = data.archive_file.create_todo_zip.output_base64sha256
  handler          = "createTodo.handler"
  runtime          = "nodejs16.x"
  role             = aws_iam_role.lambda_exec.arn
}

data "archive_file" "create_comment_zip" {
  type        = "zip"
  source_file = "lambdas/createComment.js"
  output_path = "lambdas/createComment.zip"
}

resource "aws_lambda_function" "create_comment" {
  function_name    = "CreateComment"
  filename         = data.archive_file.create_comment_zip.output_path
  source_code_hash = data.archive_file.create_comment_zip.output_base64sha256
  handler          = "createComment.handler"
  runtime          = "nodejs16.x"
  role             = aws_iam_role.lambda_exec.arn
}

data "archive_file" "get_comments_zip" {
  type        = "zip"
  source_file = "lambdas/getComments.js"
  output_path = "lambdas/getComments.zip"
}

resource "aws_lambda_function" "get_comments" {
  function_name    = "GetComments"
  filename         = data.archive_file.get_comments_zip.output_path
  source_code_hash = data.archive_file.get_comments_zip.output_base64sha256
  handler          = "getComments.handler"
  runtime          = "nodejs16.x"
  role             = aws_iam_role.lambda_exec.arn
}

data "archive_file" "delete_comment_by_id_zip" {
  type        = "zip"
  source_file = "lambdas/deleteCommentById.js"
  output_path = "lambdas/deleteCommentById.zip"
}

resource "aws_lambda_function" "delete_comment_by_id" {
  function_name    = "DeleteCommentById"
  filename         = data.archive_file.delete_comment_by_id_zip.output_path
  source_code_hash = data.archive_file.delete_comment_by_id_zip.output_base64sha256
  handler          = "deleteCommentById.handler"
  runtime          = "nodejs16.x"
  role             = aws_iam_role.lambda_exec.arn
}

data "archive_file" "create_like_zip" {
  type        = "zip"
  source_file = "lambdas/createLike.js"
  output_path = "lambdas/createLike.zip"
}

resource "aws_lambda_function" "create_like" {
  function_name    = "CreateLike"
  filename         = data.archive_file.create_like_zip.output_path
  source_code_hash = data.archive_file.create_like_zip.output_base64sha256
  handler          = "createLike.handler"
  runtime          = "nodejs16.x"
  role             = aws_iam_role.lambda_exec.arn
}

data "archive_file" "get_likes_zip" {
  type        = "zip"
  source_file = "lambdas/getLikes.js"
  output_path = "lambdas/getLikes.zip"
}

resource "aws_lambda_function" "get_likes" {
  function_name    = "GetLikes"
  filename         = data.archive_file.get_likes_zip.output_path
  source_code_hash = data.archive_file.get_likes_zip.output_base64sha256
  handler          = "getLikes.handler"
  runtime          = "nodejs16.x"
  role             = aws_iam_role.lambda_exec.arn
}

data "archive_file" "delete_like_by_id_zip" {
  type        = "zip"
  source_file = "lambdas/deleteLikeById.js"
  output_path = "lambdas/deleteLikeById.zip"
}

resource "aws_lambda_function" "delete_like_by_id" {
  function_name    = "DeleteLikeById"
  filename         = data.archive_file.delete_like_by_id_zip.output_path
  source_code_hash = data.archive_file.delete_like_by_id_zip.output_base64sha256
  handler          = "deleteLikeById.handler"
  runtime          = "nodejs16.x"
  role             = aws_iam_role.lambda_exec.arn
}

# IAM role which dictates what other AWS services the Lambda function
# may access.
resource "aws_iam_role" "lambda_exec" {
  name = "serverless_example_lambda"

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


resource "aws_iam_role_policy" "lambda_policy" {
  name = "lambda_policy"
  role = aws_iam_role.lambda_exec.id

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ListAndDescribe",
            "Effect": "Allow",
            "Action": [
                "dynamodb:List*",
                "dynamodb:DescribeReservedCapacity*",
                "dynamodb:DescribeLimits",
                "dynamodb:DescribeTimeToLive"
            ],
            "Resource": "*"
        },
        {
            "Sid": "SpecificTable",
            "Effect": "Allow",
            "Action": [
                "dynamodb:BatchGet*",
                "dynamodb:DescribeStream",
                "dynamodb:DescribeTable",
                "dynamodb:Get*",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:BatchWrite*",
                "dynamodb:CreateTable",
                "dynamodb:Delete*",
                "dynamodb:Update*",
                "dynamodb:PutItem"
            ],
            "Resource": [
              "${aws_dynamodb_table.todos.arn}*",
              "${aws_dynamodb_table.comments.arn}*",
              "${aws_dynamodb_table.likes.arn}*"
            ]
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}