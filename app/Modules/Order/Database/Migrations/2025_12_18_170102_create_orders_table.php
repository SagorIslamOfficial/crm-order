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
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('order_number', 20)->unique();
            $table->uuid('shop_id');
            $table->uuid('customer_id');
            $table->date('delivery_date');
            $table->text('delivery_address')->nullable();
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->decimal('advance_paid', 12, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->enum('discount_type', ['fixed', 'percentage'])->default('fixed');
            $table->decimal('due_amount', 12, 2)->default(0);
            $table->enum('status', ['pending', 'delivered', 'cancelled'])->default('pending');
            $table->timestamps();

            $table->foreign('shop_id')
                ->references('id')
                ->on('shops')
                ->cascadeOnDelete();

            $table->foreign('customer_id')
                ->references('id')
                ->on('customers')
                ->restrictOnDelete();

            $table->index(['shop_id', 'created_at']);
            $table->index(['customer_id', 'created_at']);
            $table->index(['status', 'created_at']);
            $table->index('order_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
