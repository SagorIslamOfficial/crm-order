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
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('order_id');
            $table->enum('method', ['cash', 'bkash', 'nagad', 'bank']);
            $table->decimal('amount', 12, 2);
            $table->string('transaction_id', 100)->nullable();
            $table->string('account_number', 50)->nullable();
            $table->string('bank_name', 100)->nullable();
            $table->string('mfs_provider')->nullable();
            $table->string('mfs_number', 11)->nullable();
            $table->timestamp('paid_at');
            $table->timestamps();

            $table->foreign('order_id')
                ->references('id')
                ->on('orders')
                ->cascadeOnDelete();

            $table->index('order_id');
            $table->index('paid_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
