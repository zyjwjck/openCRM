"""Automatic commission accrual hooks.

Signals run post-save/post-delete so they observe the final persisted state
(invoice.total_amount, payment sums). Exceptions are swallowed and logged:
commission bookkeeping must never break core invoicing flows.
"""

import logging

from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from invoices.models import Invoice, Payment

from commission.services import on_invoice_saved, on_payment_saved, reverse_payment

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Invoice)
def handle_invoice_saved(sender, instance, **kwargs):
    try:
        on_invoice_saved(instance)
    except Exception:
        logger.exception("Failed to calculate provisional commission for invoice %s", instance.id)


@receiver(post_save, sender=Payment)
def handle_payment_saved(sender, instance, created, **kwargs):
    if not created:
        return
    try:
        on_payment_saved(instance)
    except Exception:
        logger.exception("Failed to accrue earned commission for payment %s", instance.id)


@receiver(post_delete, sender=Payment)
def handle_payment_deleted(sender, instance, **kwargs):
    try:
        reverse_payment(instance)
    except Exception:
        logger.exception("Failed to reverse commission for payment %s", instance.id)
