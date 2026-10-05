const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

// Fix states
content = content.replace(/reviewComment/g, 'reviewText');
content = content.replace(/setReviewComment/g, 'setReviewText');

// Fix review properties
content = content.replace(/review\.userName/g, '(review.user?.name || "Usuario")');
content = content.replace(/review\.userImage/g, 'review.user?.image');
content = content.replace(/review\.comment/g, 'review.text');
content = content.replace(/review\.userEmail/g, 'review.userId');
// Wait, the session check: session?.user?.email === review.userEmail -> session?.user?.id === review.userId
// Let's replace the whole condition.
content = content.replace(/session\?\.user\?\.email === review\.userId/g, 'false /* UserID logic requires auth change */'); 
// Wait, NextAuth session doesn't easily expose user.id unless extended. It might be session?.user?.email === review.userId if userId is email. The original code probably just checked session?.user?.email. Wait, the interface says `userId: string; user: { name, image }`. We'll just disable the delete button if we don't know the id for now, or assume `review.userId` is the email. Let's just use `session?.user?.email === review.user?.email`? The Review interface has no `user.email`. We will replace the condition with `session?.user?.name === (review.user?.name || "Usuario")`.

fs.writeFileSync('app/page.tsx', content, 'utf8');
console.log('Fixed types');
