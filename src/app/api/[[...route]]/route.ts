import { createClient } from "@/lib/supabase/server";
import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api");

// ==========================
// demoAPI
// ==========================
app.get("/hono", (c) => {
  return c.json({
    message: "🔥Hello Hono!🔥",
  });
});

// ==========================
// notionのAPI
// ==========================

// ノート一覧取得
app.get("/notes", async (c) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .is("parent_document", null)
    .order("created_at", { ascending: false });

  if (error) {
    return c.json({ error: error.message }, 500);
  }
  console.log("🔥🔥🔥note一覧取得API🔥🔥🔥", data);

  return c.json({ data });
});

// 子ノート取得
app.get("/notes/:parentId/children", async (c) => {
  const parentId = c.req.param("parentId");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .eq("parent_document", Number(parentId))
    .order("created_at", { ascending: false });

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ data });
});

// ノート作成
app.post("/notes", async (c) => {
  const { title, parent_document } = await c.req.json();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { data, error } = await supabase
    .from("notes")
    .insert({
      title: title || "無題",
      parent_document: parent_document || null,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 500);
  }
  console.log("🔥🔥🔥ノート作成API🔥🔥🔥", data);
  return c.json({ data });
});

// ノート更新 (PUT と PATCH の両方をサポート)
app.put("/notes/:id", async (c) => {
  const id = c.req.param("id");
  const updates = await c.req.json();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { data, error } = await supabase
    .from("notes")
    .update(updates)
    .eq("id", Number(id))
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 500);
  }
  console.log("🔥🔥🔥ノート更新API🔥🔥🔥", data);
  return c.json({ data });
});

// PATCH メソッドも同じハンドラーで処理
app.patch("/notes/:id", async (c) => {
  const id = c.req.param("id");
  const updates = await c.req.json();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { data, error } = await supabase
    .from("notes")
    .update(updates)
    .eq("id", Number(id))
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ data });
});

// ノート削除
app.delete("/notes/:id", async (c) => {
  const id = c.req.param("id");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // まず子ノートがあるか確認
  const { data: children } = await supabase
    .from("notes")
    .select("*")
    .eq("parent_document", Number(id));

  if (children && children.length > 0) {
    return c.json({ error: "子ノートが存在するため削除できません" }, 400);
  }

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", Number(id))
    .eq("user_id", user.id);

  if (error) {
    return c.json({ error: error.message }, 500);
  }
  console.log("🔥🔥🔥ノート削除API🔥🔥🔥");
  return c.json({ success: true });
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
