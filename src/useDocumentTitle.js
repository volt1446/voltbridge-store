import {useEffect} from "react";

export function useDocumentTitle(title, description){

    useEffect(() => {

        if(title) {
            document.title = title;
        }

        if(description) {
             let metaDescription = document.querySelector('meta[name="description"]');
             if (metaDescription) {
                metaDescription.setAttribute('content',  description);

             }else{
                const newMeta = document.createElement('meta');
                newMeta.name = 'description';
                newMeta.content = description;
                document.head.appendChild(newMeta);
             }

        }
    }, [title, description]);
}