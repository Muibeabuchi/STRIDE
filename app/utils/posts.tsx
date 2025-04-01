import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import axios from "redaxios";

export type GeoType = {
  lat: string;
  lng: string;
};

export type AddressType = {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: GeoType;
};

export type CompanyType = {
  name: string;
  catchPhrase: string;
  bs: string;
};

export type UserType = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: AddressType;
  phone: string;
  website: string;
  company: CompanyType;
};

export interface PostType {
  id: string;
  title: string;
  body: string;
}

export interface SinglePostType extends PostType {
  userId: string;
}

export const fetchPost = createServerFn({ method: "GET" })
  .validator((postId: string) => postId)
  .handler(async ({ data }) => {
    console.info(`Fetching post with id ${data}...`);

    const post = await axios
      .get<PostType>(`https://jsonplaceholder.typicode.com/posts/${data}`)
      .then((r) => r.data)
      .catch((err) => {
        if (err.status === 404) {
          throw notFound();
        }
        throw err;
      });

    return post;
  });

export const fetchPosts = createServerFn({ method: "GET" }).handler(
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 7000));
    const posts = axios
      .get<Array<PostType>>("https://jsonplaceholder.typicode.com/posts")
      .then((r) => r.data.slice(0, 10));

    return posts;
  }
);

export async function fetchPostsOnClient() {
  await new Promise((resolve) => setTimeout(resolve, 7000));
  const posts = axios
    .get<Array<PostType>>("https://jsonplaceholder.typicode.com/posts")
    .then((r) => r.data.slice(0, 10));
  return posts;
}

export const fetchSinglePostOnServer = createServerFn({ method: "GET" })
  .validator((postId: string) => postId)
  .handler(async ({ data }) => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const singlePost = await axios
      .get<SinglePostType>(`https://jsonplaceholder.typicode.com/posts/${data}`)
      .then((r) => r.data);

    return singlePost;
  });

export async function fetchSinglePost(postId: number): Promise<SinglePostType> {
  const singlePost = await axios
    .get<SinglePostType>(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    .then((r) => r.data);

  return singlePost;
}

export const fetchSingleUsers = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async (ctx) => {
    const singleUser = axios
      .get<UserType>(`https://jsonplaceholder.typicode.com/users/${ctx.data}`)
      .then((r) => r.data);

    return singleUser;
  });

export const fetchAllUsers = createServerFn({ method: "GET" }).handler(
  async () => {
    const allUser = axios
      .get<UserType[]>(`https://jsonplaceholder.typicode.com/users`)
      .then((r) => r.data);

    return allUser;
  }
);
