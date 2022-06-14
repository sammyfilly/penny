import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Details } from './Details';

const Meta: ComponentMeta<typeof Details> = {
  title: 'Features / Product Page / Components / Details',
  component: Details
};

const Template: ComponentStory<typeof Details> = (args) => <Details {...args} />;

export const _Details = Template.bind({});
_Details.args = {
  details: {
    text: {
      primary: 'The <i>Fine</i> Details',
      secondary:
        'Our patented padded snack sleeve construction protects your <b>favorite</b> treats from getting smooshed during all-day adventures, long shifts at work, and tough travel schedules.'
    },
    details: [
      {
        image: {
          url: 'https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg',
          altText: 'Drawstring top with elastic loop closure and textured interior padding.'
        },
        description:
          'The 20L model has enough space for 370 candy bars, 6 cylinders of chips, 1,220 standard gumballs, or any combination of on-the-go treats that your heart desires. Yes, we did the math.'
      },
      {
        image: {
          url: 'https://tailwindui.com/img/ecommerce-images/product-page-04-detail-product-shot-02.jpg',
          altText: 'Front zipper pouch with included key ring.'
        },
        description:
          'Up your snack organization game with multiple compartment options. The quick-access stash pouch is ready for even the most unexpected snack attacks and sharing needs.'
      }
    ]
  }
};

export default Meta;
