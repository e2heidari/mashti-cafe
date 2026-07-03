import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'wholesaleOrder',
  title: 'Wholesale Order',
  type: 'document',
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Submitted', value: 'submitted' },
          { title: 'Under Review', value: 'under_review' },
          { title: 'Finalized', value: 'finalized' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'submitted',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customer',
      title: 'Customer',
      type: 'object',
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
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'requestedItems',
      title: 'Requested Items',
      type: 'array',
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
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'finalizedItems',
      title: 'Finalized Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'productId',
              title: 'Product ID',
              type: 'string',
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
            }),
            defineField({
              name: 'unitValue',
              title: 'Unit Value',
              type: 'number',
            }),
            defineField({
              name: 'unitLabel',
              title: 'Unit Label',
              type: 'string',
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
            }),
            defineField({
              name: 'finalizedQuantity',
              title: 'Finalized Quantity',
              type: 'number',
            }),
            defineField({
              name: 'lineTotal',
              title: 'Line Total',
              type: 'number',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'finalizedTotalAmount',
      title: 'Finalized Total Amount',
      type: 'number',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'finalizedAt',
      title: 'Finalized At',
      type: 'datetime',
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
      return {
        title: orderNumber || 'Wholesale Order',
        subtitle: `${businessName || 'Unknown business'} • ${status || 'submitted'} • ${submittedAt ? new Date(submittedAt).toLocaleDateString() : ''}`,
      }
    },
  },
})
