<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('material_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('material_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug');
            $table->json('blocks')->nullable();
            $table->string('image')->nullable();
            $table->string('image_caption')->nullable();
            $table->string('layout_variant', 20)->default('default');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['material_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('material_sections');
    }
};
