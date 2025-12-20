<?php

namespace App;

enum OrderStatus: string
{
    case Pending = 'pending';
    case Delivered = 'delivered';
    case Cancelled = 'cancelled';
}
