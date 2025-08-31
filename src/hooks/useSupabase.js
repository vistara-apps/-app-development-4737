import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * A custom hook for interacting with Supabase
 * @param {string} table - The name of the table to query
 * @param {Object} options - Query options
 * @returns {Object} - Query state and functions
 */
export function useSupabaseQuery(table, options = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  const {
    columns = '*',
    filters = {},
    order = null,
    limit = null,
    single = false,
    skip = false,
  } = options;

  useEffect(() => {
    if (skip) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        let query = supabase.from(table).select(columns, { count: 'exact' });

        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (typeof value === 'object' && value.operator) {
              // Handle custom operators like gt, lt, gte, lte, etc.
              const { operator, value: operatorValue } = value;
              query = query[operator](key, operatorValue);
            } else {
              // Default to equality
              query = query.eq(key, value);
            }
          }
        });

        // Apply ordering
        if (order) {
          const { column, ascending = true } = order;
          query = query.order(column, { ascending });
        }

        // Apply limit
        if (limit) {
          query = query.limit(limit);
        }

        // Execute query
        const { data: result, error: queryError, count: totalCount } = single
          ? await query.single()
          : await query;

        if (queryError) throw queryError;

        setData(result);
        setCount(totalCount || 0);
      } catch (err) {
        console.error('Error fetching data from Supabase:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [table, JSON.stringify(columns), JSON.stringify(filters), JSON.stringify(order), limit, single, skip]);

  // Function to refetch data
  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from(table).select(columns, { count: 'exact' });

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object' && value.operator) {
            const { operator, value: operatorValue } = value;
            query = query[operator](key, operatorValue);
          } else {
            query = query.eq(key, value);
          }
        }
      });

      // Apply ordering
      if (order) {
        const { column, ascending = true } = order;
        query = query.order(column, { ascending });
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      // Execute query
      const { data: result, error: queryError, count: totalCount } = single
        ? await query.single()
        : await query;

      if (queryError) throw queryError;

      setData(result);
      setCount(totalCount || 0);
      return { data: result, count: totalCount };
    } catch (err) {
      console.error('Error refetching data from Supabase:', err);
      setError(err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  // Function to insert data
  const insert = async (values) => {
    try {
      const { data: result, error: insertError } = await supabase
        .from(table)
        .insert(values)
        .select();

      if (insertError) throw insertError;

      // Refetch to update the data state
      await refetch();
      return { data: result };
    } catch (err) {
      console.error('Error inserting data to Supabase:', err);
      return { error: err };
    }
  };

  // Function to update data
  const update = async (values, conditions) => {
    try {
      let query = supabase.from(table).update(values);

      // Apply conditions
      Object.entries(conditions).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { data: result, error: updateError } = await query.select();

      if (updateError) throw updateError;

      // Refetch to update the data state
      await refetch();
      return { data: result };
    } catch (err) {
      console.error('Error updating data in Supabase:', err);
      return { error: err };
    }
  };

  // Function to delete data
  const remove = async (conditions) => {
    try {
      let query = supabase.from(table).delete();

      // Apply conditions
      Object.entries(conditions).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { data: result, error: deleteError } = await query;

      if (deleteError) throw deleteError;

      // Refetch to update the data state
      await refetch();
      return { data: result };
    } catch (err) {
      console.error('Error deleting data from Supabase:', err);
      return { error: err };
    }
  };

  return {
    data,
    error,
    loading,
    count,
    refetch,
    insert,
    update,
    remove,
  };
}

/**
 * A custom hook for Supabase authentication
 * @returns {Object} - Auth state and functions
 */
export function useSupabaseAuth() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (error) setError(error);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options,
      });
      if (error) throw error;
      return { data };
    } catch (err) {
      setError(err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { data };
    } catch (err) {
      setError(err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (err) {
      setError(err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
  };
}

export default { useSupabaseQuery, useSupabaseAuth };

