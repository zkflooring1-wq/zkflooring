import TestimonialEditor from '../_components/TestimonialEditor';

export default function EditTestimonial({ params }: { params: { id: string } }) {
  return <TestimonialEditor id={params.id} />;
}
