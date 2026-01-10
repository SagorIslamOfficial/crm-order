<?php

namespace App\Enum;

enum DiscountType: string
{
    case Fixed = 'fixed';
    case Percentage = 'percentage';
}
