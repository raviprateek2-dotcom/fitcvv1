const fs = require('fs');
const path = require('path');

// Read the original JS/TS file with the blogPosts array
const blogPostsPath = path.join(__dirname, 'src/lib/blog-posts.ts');
let blogPostsData = fs.readFileSync(blogPostsPath, 'utf8');

// A quick hacky way to extract the array of objects without full parsing
// We know the structure: export const blogPosts: BlogPost[] = [ ... ];
const startIndex = blogPostsData.indexOf('[');
const endIndex = blogPostsData.lastIndexOf(']');
const arrayString = blogPostsData.substring(startIndex, endIndex + 1);

let blogPosts = [];
try {
  // We have to evaluate this string in a context to convert it to a real JS array. 
  // It's safe since it's our own static code.
  blogPosts = eval(`(${arrayString})`);
} catch (e) {
  console.error("Failed to parse array", e);
  process.exit(1);
}

// Create the target directory
const targetDir = path.join(__dirname, 'content/blog');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

for (const post of blogPosts) {
  const frontmatter = `---
title: "${post.title.replace(/"/g, '\\"')}"
description: "${post.description.replace(/"/g, '\\"')}"
imageId: "${post.imageId}"
createdAt: "${post.createdAt}"
updatedAt: "${post.updatedAt}"
---
`;

  const mdxContent = frontmatter + '\n' + post.content.trim();
  const filePath = path.join(targetDir, `${post.slug}.mdx`);
  
  fs.writeFileSync(filePath, mdxContent, 'utf8');
  console.log(`Created ${filePath}`);
}

console.log("Migration complete!");
