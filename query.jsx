// query.jsx
import { supabase } from "./src/supabaseClient";

// Get all modules
export const getAllModules = async () => {
  try {
    const { data, error } = await supabase
      .from("modules")   // nama tabel
      .select("*");      // ambil semua kolom

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error fetching modules:", err.message);
    return [];
  }
};

export const getUserModules = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("modules")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user modules:", error);
    return [];
  }

  return data.modules || [];
};

export const insertUsers = async (id, username, email) => {
  // cek apakah user sudah ada
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .limit(1);

  if (error) return { success: false, message: error.message };
  if (data && data.length > 0) return { success: false, message: "user already exist!" };

  // insert user baru
  const { data: insertData, error: insertError } = await supabase
    .from("users")
    .insert([
      {
        id: id,
        username: username,
        email: email
      }
    ])
    .select()
    .single(); // langsung ambil satu row

  if (insertError) return { success: false, message: insertError.message };

  return { success: true, data: insertData };
};


export const addModuleToUser = async (userId, moduleId) => {
  // Ambil modul saat ini
  const { data: userData, error: fetchError } = await supabase
    .from("users")
    .select("modules")
    .eq("id", userId)
    .single();

  if (fetchError) return { success: false, message: fetchError.message };

  // Pastikan currentModules dideklarasikan
  const currentModules = userData.modules || [];
  const normalizedModuleId = String(moduleId); // pastikan string

  if (currentModules.includes(normalizedModuleId)) {
    return { success: false, message: "Modul sudah ditambahkan" };
  }

  const updatedModules = [...currentModules, normalizedModuleId];


  // Update kolom modules
  const { data, error: updateError } = await supabase
    .from("users")
    .update({ modules: updatedModules })
    .eq("id", userId)
    .select()
    .single();

  if (updateError) return { success: false, message: updateError.message };

  return { success: true, data };
};


// Ambil semua forum beserta replies
export const getForum = async () => {
  try {
    const { data, error } = await supabase
      .from("forums")
      .select(`
        *,
        replies:replies(*)   -- relasi ke tabel replies
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching forum:", error.message);
    throw error;
  }
};

// Posting forum baru
export const postForum = async (text, username, sentiment) => {
  try {
    const { data, error } = await supabase
      .from("forums")
      .insert([{ text, username: username, sentiment }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error posting forum:", error.message);
    throw error;
  }
};

// Upvote forum
export const upvoteForum = async (forumId, username) => {
  try {
    const { data: existingVote, error: voteError } = await supabase
      .from("forum_votes")
      .select("*")
      .eq("forum_id", forumId)
      .eq("username", username)  // jangan encodeURIComponent
      .single();



    if (voteError && voteError.code !== "PGRST116") throw voteError;

    if (existingVote) {
      // Update vote
      const { data, error } = await supabase
        .from("forum_votes")
        .update({ vote_type: "up" })
        .eq("id", existingVote.id); // harus pakai id
      if (error) throw error;
      return data;
    } else {
      // Insert vote baru
      const { data, error } = await supabase
        .from("forum_votes")
        .insert([{ forum_id: forumId, username, vote_type: "up" }]);
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error("Error upvoting forum:", error.message);
    throw error;
  }
};


// Downvote forum
export const downvoteForum = async (forumId, username) => {
  try {
    const { data: existingVote, error: voteError } = await supabase
      .from("forum_votes")
      .select("*")
      .eq("forum_id", forumId)
      .eq("username", username)  // jangan encodeURIComponent
      .single();


    if (voteError && voteError.code !== "PGRST116") throw voteError;

    if (existingVote) {
      const { data, error } = await supabase
        .from("forum_votes")
        .update({ vote_type: "down" })
        .eq("id", existingVote.id); // <- fix di sini
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from("forum_votes")
        .insert([{ forum_id: forumId, username, vote_type: "down" }]);
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error("Error downvoting forum:", error.message);
    throw error;
  }
};


// Menambahkan reply
export const addReplyForum = async (forumId, username, text) => {
  try {
    const { data, error } = await supabase
      .from("replies")
      .insert([{ forum_id: forumId, username, text }])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error adding reply:", error.message);
    throw error;
  }
};


export const toggleVoteForum = async (forumId, username, type) => {
  try {
    // ambil vote user di forum_votes
    const { data: existingVote, error: voteError } = await supabase
      .from("forum_votes")
      .select("*")
      .eq("forum_id", forumId)
      .eq("username", username)
      .single();

    if (voteError && voteError.code !== "PGRST116") throw voteError;

    // ambil forum untuk counters
    const { data: forumData, error: forumError } = await supabase
      .from("forums")
      .select("upvote_count, downvote_count")
      .eq("id", forumId)
      .single();

    if (forumError) throw forumError;

    let upCount = forumData.upvote_count || 0;
    let downCount = forumData.downvote_count || 0;

    if (existingVote) {
      if (existingVote.vote_type === type) {
        // klik vote yang sama → hapus vote
        const { error: delError } = await supabase
          .from("forum_votes")
          .delete()
          .eq("id", existingVote.id);
        if (delError) throw delError;

        if (type === "up") upCount = Math.max(0, upCount - 1);
        else downCount = Math.max(0, downCount - 1);

      } else {
        // ubah vote → update kolom vote_type
        const { error: updateError } = await supabase
          .from("forum_votes")
          .update({ vote_type: type })
          .eq("id", existingVote.id);
        if (updateError) throw updateError;

        // kurangi counter vote sebelumnya, tambah counter vote baru
        if (existingVote.vote_type === "up") upCount = Math.max(0, upCount - 1);
        if (existingVote.vote_type === "down") downCount = Math.max(0, downCount - 1);

        if (type === "up") upCount++;
        else downCount++;
      }
    } else {
      // insert vote baru
      const { error: insertError } = await supabase
        .from("forum_votes")
        .insert([{ forum_id: forumId, username, vote_type: type }]);
      if (insertError) throw insertError;

      if (type === "up") upCount++;
      else downCount++;
    }


    // update counters di tabel forums
    const { error: counterError } = await supabase
      .from("forums")
      .update({ upvote_count: upCount, downvote_count: downCount })
      .eq("id", forumId);

    if (counterError) throw counterError;

    return { upvote_count: upCount, downvote_count: downCount };
  } catch (error) {
    console.error("Error toggling vote:", error.message);
    throw error;
  }
};

