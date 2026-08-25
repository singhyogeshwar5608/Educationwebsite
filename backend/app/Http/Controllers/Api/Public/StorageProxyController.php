<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class StorageProxyController extends Controller
{
    /**
     * Serve a storage file as a base64 JSON payload.
     *
     * Hostinger's CDN (hcdn) treats any URL ending in an image extension
     * (.jpg/.png/...) as a static asset and strips Access-Control-Allow-*
     * headers from it — even for JSON bodies served on such URLs. This route's
     * URL has NO file extension, so it is treated as a dynamic response and
     * CORS headers pass through, letting cross-origin frontends draw a data:
     * URL onto a canvas without tainting it.
     *
     * Usage: GET /api/storage-base64?path=students/xxx.jpg
     */
    public function base64(Request $request)
    {
        $path = str_replace(['..', "\0"], '', (string) $request->query('path', ''));
        $file = storage_path('app/public/' . ltrim($path, '/'));

        if ($path === '' || !is_file($file)) {
            abort(404, 'File not found');
        }

        $mime = mime_content_type($file) ?: 'application/octet-stream';

        return response()->json([
            'mime' => $mime,
            'data' => 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($file)),
        ]);
    }

    /**
     * Serve a storage file through the API so cross-origin frontends can load it
     * for canvas rendering (CORS is applied to api/* by Laravel).
     *
     * Path format: /api/storage/{path} where {path} = students/xxx.jpg etc.
     */
    public function show(Request $request, string $path): Response
    {
        $file = storage_path('app/public/' . ltrim($path, '/'));

        if (!is_file($file)) {
            abort(404, 'File not found');
        }

        $mime = mime_content_type($file) ?: 'application/octet-stream';

        // JSON base64 mode: Hostinger's CDN (hcdn) strips Access-Control-Allow-*
        // headers from binary/image responses, which breaks canvas rendering
        // cross-origin. JSON responses pass through with CORS intact, so the
        // frontend can request ?format=b64 and draw a data: URL instead.
        if ($request->query('format') === 'b64') {
            return response()->json([
                'mime' => $mime,
                'data' => 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($file)),
            ]);
        }

        // No-store so the Hostinger CDN does not cache this response and strip
        // the CORS headers (which would break canvas/PDF export).
        return response(file_get_contents($file), 200, [
            'Content-Type' => $mime,
            'Cache-Control' => 'no-store, private, max-age=0',
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-XSRF-TOKEN',
        ]);
    }
}
