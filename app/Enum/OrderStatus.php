<?php

namespace App\Enum;

enum OrderStatus: string
{
    case Pending = 'pending';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';
}
