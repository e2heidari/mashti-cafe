import { ALL_FIELDS_GROUP, defineField, defineType } from 'sanity'

import { FinalizedTotalPreviewInput } from '../sanity/plugins/wholesaleOrder/FinalizedTotalPreviewInput'

const WHOLESALE_ORDER_STATUS_OPTIONS = [
  { title: 'Submitted', value: 'submitted' },
  { title: 'Under Review', value: 'under_review' },
  { title: 'Finalized', value: 'finalized' },
  { title: 'Sending final order', value: 'sending_quote' },
  { title: 'Final order sent', value: 'quote_sent' },
  { title: 'Final order send failed', value: 'quote_send_failed' },
  { title: 'Cancelled', value: 'cancelled' },
] as const

function wholesaleOrderStatusLabel(status: string | undefined): string {
  if (!status) {
    return 'Submitted'
  }

  return (
    WHOLESALE_ORDER_STATUS_OPTIONS.find((option) => option.value === status)
      ?.title ?? status
  )
}

export default defineType({
  name: 'wholesaleOrder',
  title: 'Wholesale Order',
  type: 'document',
  groups: [
    { name: 'requested', title: 'Requested Order Info', default: true },
    { name: 'finalized', title: 'Finalized Order Info' },
    { name: 'emailTracking', title: 'Email / Send Tracking' },
    { ...ALL_FIELDS_GROUP, hidden: true },
  ],
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      group: 'requested',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'requested',
      options: {
        list: [...WHOLESALE_ORDER_STATUS_OPTIONS],
      },
      initialValue: 'submitted',
      validation: (Rule) => Rule.required(),
      readOnly: true,
      description:
        'Part of the customer request snapshot. Status is updated automatically by the order workflow.',
    }),
    defineField({
      name: 'customer',
      title: 'Customer',
      type: 'object',
      group: 'requested',
      readOnly: true,
      description:
        "Requested Order Info contains the customer's original request and cannot be edited.",
      fields: [
        defineField({
          name: 'businessName',
          title: 'Business Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'contactName',
          title: 'Contact Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: (Rule) => Rule.required().email(),
        }),
        defineField({
          name: 'phone',
          title: 'Phone',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'deliveryAddress',
          title: 'Delivery Address',
          type: 'text',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'message',
          title: 'Message / Notes',
          type: 'text',
          description: 'Notes from the customer at order request time.',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'requestedItems',
      title: 'Requested Items',
      type: 'array',
      group: 'requested',
      readOnly: true,
      description:
        "Requested Order Info contains the customer's original request and cannot be edited. Use Finalized Order Info to prepare the final order.",
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'productId',
              title: 'Product ID',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'sku',
              title: 'SKU',
              type: 'string',
            }),
            defineField({
              name: 'productName',
              title: 'Product Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
            }),
            defineField({
              name: 'unitType',
              title: 'Unit Type',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'unitValue',
              title: 'Unit Value',
              type: 'number',
              validation: (Rule) => Rule.required().positive(),
            }),
            defineField({
              name: 'unitLabel',
              title: 'Unit Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'weight',
              title: 'Weight (Legacy)',
              type: 'string',
              hidden: true,
            }),
            defineField({
              name: 'unitPrice',
              title: 'Unit Price',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: 'requestedQuantity',
              title: 'Requested Quantity',
              type: 'number',
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: 'lineTotal',
              title: 'Line Total',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'requestedTotalAmount',
      title: 'Requested Total Amount',
      type: 'number',
      group: 'requested',
      readOnly: true,
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      group: 'requested',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'finalizedItems',
      title: 'Finalized Items',
      type: 'array',
      group: 'finalized',
      description:
        'Use Finalized Order Info to prepare the final order before sending it to the customer. Adjust quantity and unit price, remove unavailable products, then send the final order.',
      of: [
        {
          type: 'object',
          name: 'finalizedLineItem',
          title: 'Finalized Line Item',
          fields: [
            defineField({
              name: 'productId',
              title: 'Product ID',
              type: 'string',
              readOnly: true,
              description: 'Catalog reference — copied from the customer request.',
            }),
            defineField({
              name: 'sku',
              title: 'SKU',
              type: 'string',
              readOnly: true,
            }),
            defineField({
              name: 'productName',
              title: 'Product Name',
              type: 'string',
              readOnly: true,
            }),
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              readOnly: true,
            }),
            defineField({
              name: 'unitType',
              title: 'Unit Type',
              type: 'string',
              readOnly: true,
            }),
            defineField({
              name: 'unitValue',
              title: 'Unit Value',
              type: 'number',
              readOnly: true,
            }),
            defineField({
              name: 'unitLabel',
              title: 'Unit Label',
              type: 'string',
              readOnly: true,
            }),
            defineField({
              name: 'weight',
              title: 'Weight (Legacy)',
              type: 'string',
              hidden: true,
            }),
            defineField({
              name: 'unitPrice',
              title: 'Unit Price',
              type: 'number',
              description: 'Quoted price per unit for this line.',
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: 'finalizedQuantity',
              title: 'Finalized Quantity',
              type: 'number',
              description: 'Quantity included in the final order.',
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: 'lineTotal',
              title: 'Line Total',
              type: 'number',
              readOnly: true,
              description: 'unitPrice × finalizedQuantity — update manually if you change price or quantity.',
            }),
          ],
          preview: {
            select: {
              productName: 'productName',
              sku: 'sku',
              finalizedQuantity: 'finalizedQuantity',
              unitPrice: 'unitPrice',
              lineTotal: 'lineTotal',
            },
            prepare({ productName, sku, finalizedQuantity, unitPrice, lineTotal }) {
              const qty = finalizedQuantity != null ? `× ${finalizedQuantity}` : ''
              const price =
                unitPrice != null ? `@ $${Number(unitPrice).toFixed(2)}` : ''
              const total =
                lineTotal != null ? ` = $${Number(lineTotal).toFixed(2)}` : ''
              return {
                title: productName || 'Line item',
                subtitle: [sku, qty, price, total].filter(Boolean).join(' '),
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'finalizedTotalPreview',
      title: 'Current Calculated Order Total',
      type: 'string',
      group: 'finalized',
      readOnly: true,
      description:
        'Live preview from finalized line items. Preview only. Does not modify the saved order.',
      components: {
        input: FinalizedTotalPreviewInput,
      },
    }),
    defineField({
      name: 'finalizedTotalAmount',
      title: 'Finalized Total Amount',
      type: 'number',
      group: 'finalized',
      readOnly: true,
      description:
        'Sum of finalized line totals. Synced automatically when the quote email is sent.',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'sellerNote',
      title: 'Seller Note',
      type: 'text',
      group: 'finalized',
      description: 'Note from seller included in the quote email.',
    }),
    defineField({
      name: 'finalizedAt',
      title: 'Finalized At',
      type: 'datetime',
      group: 'finalized',
      readOnly: true,
    }),
    defineField({
      name: 'finalEmailSentAt',
      title: 'Final Email Sent At',
      type: 'datetime',
      group: 'emailTracking',
      readOnly: true,
      description: 'Set automatically when the quote email is sent to the customer.',
    }),
    defineField({
      name: 'finalEmailSentTo',
      title: 'Final Email Sent To',
      type: 'string',
      group: 'emailTracking',
      readOnly: true,
      description: 'Customer email address that received the quote email.',
    }),
  ],
  preview: {
    select: {
      orderNumber: 'orderNumber',
      businessName: 'customer.businessName',
      status: 'status',
      submittedAt: 'submittedAt',
    },
    prepare({ orderNumber, businessName, status, submittedAt }) {
      const statusLabel = wholesaleOrderStatusLabel(status)
      return {
        title: orderNumber || 'Wholesale Order',
        subtitle: `${businessName || 'Unknown business'} • ${statusLabel} • ${submittedAt ? new Date(submittedAt).toLocaleDateString() : ''}`,
      }
    },
  },
})
