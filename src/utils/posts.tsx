import { notFound } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
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
    // throw new Error("test");
    const time0 = Date.now();
    console.info("waiting for 10 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 10000));
    console.info("Done: waited for 10 seconds...");
    const time1 = Date.now();
    console.log("time taken to wait", (time1 - time0) / 1000);

    const time2 = Date.now();
    console.info("Fetching posts...", time2);
    const posts = axios
      .get<Array<PostType>>("https://jsonplaceholder.typicode.com/posts")
      .then((r) => r.data.slice(0, 10));
    const time3 = Date.now();
    console.info("Done fetching posts...", time3);
    console.log("time taken to fetch posts", (time3 - time2) / 1000);

    console.log("time taken to run on the server", (time3 - time0) / 1000);
    return posts;
  }
);

export async function fetchPostsOnClient() {
  const time0 = Date.now();
  console.info("waiting for 10 seconds...");
  await new Promise((resolve) => setTimeout(resolve, 10000));
  console.info("Done waiting for 10 seconds...");
  const time1 = Date.now();
  console.info("Fetching posts...", time1);
  const posts = axios
    .get<Array<PostType>>("https://jsonplaceholder.typicode.com/posts")
    .then((r) => r.data.slice(0, 10));
  const time2 = Date.now();
  console.info("Done fetching posts...", time2);
  console.info("Time taken to fetch posts:", time2 - time1);
  console.info("Time taken to prefetch posts:", time2 - time0);
  return posts;
}

export async function fetchSinglePost(postId: number): Promise<SinglePostType> {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const singlePost = axios
    .get<SinglePostType>(`https://jsonplaceholder.typicode.com/posts/${postId}`)
    .then((r) => r.data);

  return singlePost;
}

export const fetchSingleUsers = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async (ctx) => {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    const singleUser = axios
      .get<UserType>(`https://jsonplaceholder.typicode.com/users/${ctx.data}`)
      .then((r) => r.data);

    return singleUser;
  });

export const fetchAllUsers = createServerFn({ method: "GET" }).handler(
  async () => {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    const allUser = axios
      .get<UserType[]>(`https://jsonplaceholder.typicode.com/users`)
      .then((r) => r.data);

    return allUser;
  }
);

// 18541
// 4713
// 4678
// 5323
// 5614
