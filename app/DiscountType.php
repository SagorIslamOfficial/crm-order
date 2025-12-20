<?php

namespace App;

enum DiscountType: string
{
    case Fixed = 'fixed';
    case Percentage = 'percentage';
}
