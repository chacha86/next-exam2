package com.example.next.domain.post.post.dto;

import com.example.next.domain.post.post.entity.Post;
import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.NonNull;

import java.time.LocalDateTime;

@Getter
public class PostWithContentDto {

    @NonNull
    private long id;
    @NonNull
    private LocalDateTime createdDate;
    @NonNull
    private LocalDateTime modifiedDate;
    @NonNull
    private String title;
    @NonNull
    private long authorId;
    @NonNull
    private String content;
    @NonNull
    private String authorName;
    @NonNull
    private boolean published;
    @NonNull
    private boolean listed;
    @Setter
    @NonNull
    private boolean actorProcessable;

    public PostWithContentDto(Post post) {
        this.id = post.getId();
        this.createdDate = post.getCreatedDate();
        this.modifiedDate = post.getModifiedDate();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.authorId = post.getAuthor().getId();
        this.authorName = post.getAuthor().getNickname();
        this.published = post.isPublished();
        this.listed = post.isListed();
    }
}
