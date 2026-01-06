<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Order Statuses
    |--------------------------------------------------------------------------
    |
    | Define the available order statuses.
    |
    */
    'statuses' => [
        'pending' => 'Pending',
        'delivered' => 'Delivered',
        'cancelled' => 'Cancelled',
    ],

    /*
    |--------------------------------------------------------------------------
    | Print Copy Types
    |--------------------------------------------------------------------------
    |
    | Define the available print copy types.
    |
    */
    'print_copies' => ['customer', 'office', 'tailor'],

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    |
    | Default pagination settings for orders.
    |
    */
    'items_per_page' => 15,
];
