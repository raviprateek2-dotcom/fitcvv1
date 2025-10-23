
'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Autoplay from "embla-carousel-autoplay";
import { PlaceHolderImages } from '@/lib/placeholder-images';

const testimonials = [
    {
      author: 'Sarah L.',
      title: 'Software Engineer',
      quote: 'ResumeAI helped me land my dream job in just two weeks! The AI suggestions were a game-changer.',
      imageId: 'testimonial-avatar-1',
      rating: 5,
    },
    {
      author: 'John D.',
      title: 'Product Manager',
      quote: 'I\'ve never felt more confident about my resume. The templates are modern and professional.',
      imageId: 'testimonial-avatar-2',
      rating: 5,
    },
    {
      author: 'Emily C.',
      title: 'UX Designer',
      quote: 'As a designer, I appreciate the attention to detail in the templates. A fantastic tool!',
      imageId: 'testimonial-avatar-3',
      rating: 5,
    },
    {
      author: 'Mike R.',
      title: 'Marketing Director',
      quote: 'The ATS checker gave me peace of mind. I started getting more callbacks almost immediately after using ResumeAI.',
      imageId: 'testimonial-avatar-4',
      rating: 5,
    },
    {
      author: 'Jessica B.',
      title: 'Recent Graduate',
      quote: 'I was struggling to create my first resume. This tool made it so easy and helped me look professional.',
      imageId: 'testimonial-avatar-5',
      rating: 5,
    }
];

export function TestimonialsSection() {
    return (
        <section 
            className="relative w-full py-20 md:py-32 bg-secondary/30"
        >
            <div id="testimonials" className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="inline-block rounded-lg bg-background/50 backdrop-blur-sm border px-3 py-1 text-sm font-medium">What Our Users Say</div>
                <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent">Loved by Job Seekers Worldwide</h2>
            </div>
            <div>
                <Carousel
                opts={{ align: "start", loop: true }}
                plugins={[Autoplay({ delay: 5000 })]}
                className="w-full max-w-6xl mx-auto"
                >
                <CarouselContent>
                    {testimonials.map((testimonial, index) => {
                    const image = PlaceHolderImages.find(img => img.id === testimonial.imageId);
                    return (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                        <div className="p-1 h-full">
                        <Card className="flex flex-col justify-between h-full p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl" variant="neuro">
                            <CardContent className="p-0 flex flex-col gap-6">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                                ))}
                            </div>
                            <p className="text-lg text-muted-foreground flex-grow">"{testimonial.quote}"</p>
                            <div className="flex items-center gap-4 pt-6 border-t">
                                <Avatar>
                                {image && <AvatarImage src={image.imageUrl} alt={testimonial.author} />}
                                <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                <p className="font-semibold">{testimonial.author}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                </div>
                            </div>
                            </CardContent>
                        </Card>
                        </div>
                    </CarouselItem>
                    )})}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex" />
                <CarouselNext className="hidden sm:flex" />
                </Carousel>
            </div>
            </div>
        </section>
    );
}
