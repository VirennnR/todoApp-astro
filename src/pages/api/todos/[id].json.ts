import type { APIRoute } from "astro";
import { todoDb } from "../../../db";

export const prerender = false;

// Update
export const PUT: APIRoute = async ({ request, params }) => {
  try {
    if (!params.id)
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );

    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );
    }

    const id = parseInt(params.id);
    await todoDb.update(id, { title, description });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};

// Toggle
export const PATCH: APIRoute = async ({ params }) => {
  try {
    if (!params.id)
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );

    const id = parseInt(params.id);
    await todoDb.toggleComplete(id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};

// Delete
export const DELETE: APIRoute = async ({ params }) => {
  try {
    if (!params.id)
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
        }
      );

    const id = parseInt(params.id!);
    await todoDb.delete(id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};
