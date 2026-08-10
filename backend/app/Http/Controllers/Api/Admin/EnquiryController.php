<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EnquiryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Enquiry::query();

        if ($request->filled('search')) {
            $query->where(fn ($q) => $q
                ->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%")
                ->orWhere('phone', 'like', "%{$request->search}%"));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $enquiries = $query->orderBy('created_at', 'desc')->get();

        return response()->json($enquiries->map(fn (Enquiry $e) => $this->map($e)));
    }

    public function show(Enquiry $enquiry): JsonResponse
    {
        return response()->json($this->map($enquiry));
    }

    public function updateStatus(Request $request, Enquiry $enquiry): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['New', 'Read', 'Replied', 'pending', 'contacted', 'closed'])],
        ]);

        $status = $validated['status'];

        if (in_array($status, ['New', 'Read', 'Replied'])) {
            $enquiry->status = $status;
        } else {
            $enquiry->status = $status;
        }

        $enquiry->save();

        return response()->json($this->map($enquiry));
    }

    public function destroy(Enquiry $enquiry): JsonResponse
    {
        $enquiry->delete();

        return response()->json(['message' => 'Enquiry deleted successfully']);
    }

    private function map(Enquiry $enquiry): array
    {
        return [
            'id' => (string) $enquiry->id,
            'name' => $enquiry->name,
            'email' => $enquiry->email,
            'mobile' => $enquiry->phone,
            'phone' => $enquiry->phone,
            'subject' => $enquiry->subject,
            'message' => $enquiry->message,
            'date' => $enquiry->created_at?->toDateString(),
            'status' => $enquiry->status === 'pending' ? 'New' : ucfirst($enquiry->status),
        ];
    }
}
