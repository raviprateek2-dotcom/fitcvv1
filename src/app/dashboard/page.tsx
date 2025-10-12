import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const resumes = [
  {
    id: '1',
    title: 'Software Engineer',
    updatedAt: '2 days ago',
    image: PlaceHolderImages.find((img) => img.id === 'dashboard-resume-1'),
  },
  {
    id: '2',
    title: 'Marketing Manager',
    updatedAt: '1 week ago',
    image: PlaceHolderImages.find((img) => img.id === 'dashboard-resume-2'),
  },
  {
    id: '3',
    title: 'Graphic Designer',
    updatedAt: '3 weeks ago',
    image: PlaceHolderImages.find((img) => img.id === 'dashboard-resume-3'),
  },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-headline font-bold">My Resumes</h1>
        <Button asChild>
          <Link href="/templates">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Resume
          </Link>
        </Button>
      </div>

      {resumes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {resumes.map((resume) => (
            <Card key={resume.id} className="overflow-hidden group">
              <CardHeader className="p-0">
                <Link href={`/editor/${resume.id}`}>
                  <div className="aspect-[3/2] overflow-hidden">
                    {resume.image && (
                      <Image
                        src={resume.image.imageUrl}
                        width={300}
                        height={200}
                        alt={resume.image.description}
                        data-ai-hint={resume.image.imageHint}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                </Link>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg font-semibold truncate">
                  <Link href={`/editor/${resume.id}`} className="hover:underline">
                    {resume.title}
                  </Link>
                </CardTitle>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm text-muted-foreground">
                <span>Updated {resume.updatedAt}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                       <Link href={`/editor/${resume.id}`}>Edit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem>Download PDF</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">No Resumes Yet</h2>
          <p className="text-muted-foreground mb-4">Click below to create your first professional resume.</p>
          <Button asChild>
            <Link href="/templates">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create a Resume
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
