async function addPostHandler(event) {
    event.preventDefault();

    const title = document.querySelector('#title-text').value.trim();
    const post_url = document.querySelector('#post-url').value.trim();
    const content = document.querySelector('textarea[name="post-content"]').value.trim();

    if(title && content){
        const response = await fetch ('/api/posts', {
            method: 'POST',
            body: JSON.stringify({
                title,
                post_url,
                content
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if(response.ok){
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.add-post').addEventListener('submit', addPostHandler);