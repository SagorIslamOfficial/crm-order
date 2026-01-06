<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shops', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code', 10)->unique();
            $table->string('name')->unique();
            $table->text('address');
            $table->string('phone', 11);
            $table->string('website')->nullable();
            $table->text('location')->nullable();
            $table->text('details')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('next_order_sequence')->default(1);
            $table->timestamps();

            $table->index('code');
            $table->index('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shops');
    }
};
