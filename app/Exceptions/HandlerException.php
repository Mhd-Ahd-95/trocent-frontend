<?php

namespace App\Exceptions;

use Throwable;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class HandlerException extends ExceptionHandler
{

    public function report(Throwable $exception)
    {
        parent::report($exception);
    }

    public function render($request, Throwable $exception)
    {
        // Return JSON if this is an API request
        if ($request->expectsJson()) {

            // Validation errors
            if ($exception instanceof ValidationException) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $exception->errors(),
                ], 422);
            }

            // Model not found
            if ($exception instanceof ModelNotFoundException) {
                $model = class_basename($exception->getModel());
                return response()->json([
                    'success' => false,
                    'message' => "$model not found",
                ], 404);
            }

            // Authorization errors
            if ($exception instanceof AuthorizationException) {
                return response()->json([
                    'success' => false,
                    'message' => $exception->getMessage() ?: 'This action is unauthorized',
                ], 403);
            }

            // HTTP exceptions (like 404 route not found)
            if ($exception instanceof HttpException) {
                return response()->json([
                    'success' => false,
                    'message' => $exception->getMessage() ?: 'HTTP error',
                ], $exception->getStatusCode());
            }

            // Generic server error
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage() ?: 'Something went wrong',
            ], 500);
        }

        // Non-API (web) requests fallback
        return parent::render($request, $exception);
    }
}
