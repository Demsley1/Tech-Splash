async function commentForm(event){
    event.preventDefault();

    const comment_text = document.querySelector('textarea[name="commet-text"]').value.trim();

    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
}