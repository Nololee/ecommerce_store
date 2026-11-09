<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $categories = Category::withCount('products')
            ->when($search, fn ($q) => $q->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
            'description' => ['nullable', 'string'],
        ]);

        $slug = Str::slug($validated['name']);
        $count = Category::where('slug', 'like', "{$slug}%")->count();
        if ($count > 0) {
            $slug = "{$slug}-".($count + 1);
        }

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? '',
        ]);

        ActivityLog::record(
            'category_created',
            "Administrator created category {$category->name}",
            $category,
            auth()->user(),
            ['name' => $category->name],
            'admin'
        );

        return back()->with('success', "Category '{$category->name}' created successfully.");
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name,'.$category->id],
            'description' => ['nullable', 'string'],
        ]);

        $category->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? '',
        ]);

        ActivityLog::record(
            'category_updated',
            "Administrator updated category {$category->name}",
            $category,
            auth()->user(),
            ['name' => $category->name],
            'admin'
        );

        return back()->with('success', "Category '{$category->name}' updated successfully.");
    }

    public function destroy(Category $category): RedirectResponse
    {
        // Safe deletion check: prevent deleting categories with products
        if ($category->products()->exists()) {
            return back()->with('error', "Cannot delete category '{$category->name}' because it contains {$category->products()->count()} products. Reassign or delete those products first.");
        }

        $name = $category->name;
        $category->delete();

        ActivityLog::record(
            'category_deleted',
            "Administrator deleted category {$name}",
            null,
            auth()->user(),
            ['name' => $name],
            'admin'
        );

        return back()->with('success', "Category '{$name}' deleted successfully.");
    }
}
