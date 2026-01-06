<?php

namespace App\Enum;

enum PaymentMethod: string
{
    case Cash = 'cash';
    case BKash = 'bkash';
    case Nagad = 'nagad';
    case Bank = 'bank';
}
