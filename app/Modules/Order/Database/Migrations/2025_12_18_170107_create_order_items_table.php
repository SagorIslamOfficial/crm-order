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
        Schema::create('order_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('order_id');
            $table->uuid('product_type_id');
            $table->uuid('product_size_id');
            $table->unsignedSmallInteger('quantity')->default(1);
            $table->decimal('price', 12, 2);
            $table->text('notes')->nullable();
            $table->decimal('line_total', 12, 2);
            $table->timestamps();

            $table->foreign('order_id')
                ->references('id')
                ->on('orders')
                ->cascadeOnDelete();

            $table->foreign('product_type_id')
                ->references('id')
                ->on('product_types')
                ->restrictOnDelete();

            $table->foreign('product_size_id')
                ->references('id')
                ->on('product_sizes')
                ->restrictOnDelete();

            $table->index('order_id');
            $table->index(['product_type_id', 'product_size_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
