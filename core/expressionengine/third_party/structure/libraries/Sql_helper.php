<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Class provides consistent wrapper classes
 * around ExpressionEngine's database class
 * to reduce the effort of common DB tasks
 */
class Sql_helper
{
	
	function __construct()
	{
		$this->EE =& get_instance();
	}
	
	/**
	 * Process an array of queries (which do not provide results)
	 * @param array $queries An array of queries
	 */
	function batch($queries)
	{	
		foreach ($queries as $query)
			$this->EE->db->query($query);
	}

	/**
	 * Execute a single row select query
	 * @param string $sql SQL select statement
	 * @return array|null An array of the fields for the row returned
	 */
	function row($sql)
	{	
		$results = $this->EE->db->query($sql);

		if ($results && $results->num_rows > 0)
			return $results->row_array();
		
		return NULL;
	}
	
	/**
	 * Execute a multi-row select query
	 * @param string $sql SQL select statement
	 * @return array An array of row arrays matched by the query
	 */
	function results($sql)
	{	
		$results = $this->EE->db->query($sql);
		if ($results->num_rows > 0)
			return $results->result_array();
		
		return array();
	}
	
	/**
	 * Update data in the database
	 * @param string $table The table to update
	 * @param array $named_fields_array An array of fields to update and their values
	 * @param string $where Limit update to rows which match these where clauses
	 * @return integer Number of rows affected or -1 on error
	 */
	function update($table, $named_fields_array, $where)
	{	
		$set_vals = array();
		foreach ($named_fields_array as $field => $val)
			$set_vals[] = "`$field` = ".(is_null($val) ? 'NULL' : "'".$this->escape($val)."'");
		
		if (count($set_vals))
		{
			$sql = "UPDATE `$table` SET ".implode(', ', $set_vals)." WHERE ".$where;
			return $this->affected($sql);
		}
		return -1;
	}
	
	/**
	 * Queries which update, replace or delete data in the database
	 * @param string $sql SQL update, replace or delete query
	 * @return integer Rows affected by the query
	 */
	function affected($sql)
	{
		$this->EE->db->query($sql);
		return $this->EE->db->affected_rows;
	}
	
	/**
	 * Insert data into the database
	 * @param string $table The table to insert into
	 * @param array $named_fields_array An array of fields to add and their values
	 * @return integer|null The auto_incremented id for the inserted row, or NULL on error
	 */
	function insert($table, $named_fields_array)
	{	
		$fields = array();
		$vals = array();
		foreach ($named_fields_array as $field => $val)
		{
			$fields[] = "`$field`";
			$vals[] = is_null($val) ? 'NULL' : "'".$this->escape($val)."'";
		}
		
		if (count($vals))
		{
			$sql = "INSERT INTO `$table` (".implode(', ', $fields).") VALUES (".implode(', ', $vals).")";
			return $this->insert_sql($sql);
		}
		return NULL;
	}
	
	/**
	 * Process an insert query
	 * @param string $sql SQL insert statement
	 * @return integer|null The auto_incremented id for the inserted row, or NULL on error
	 */
	function insert_sql($sql)
	{	
		$affected = $this->EE->db->query($sql);
		if ($affected > 0)
			return $this->EE->db->insert_id;
		
		return NULL;
	}
	
	/**
	 * Escape the data in a mysql specific way
	 * @param string $str Data to escape
	 * @return string Escaped data
	 */
	function escape($str)
	{		
		if (function_exists('mysql_real_escape_string') && is_resource($this->EE->db->conn_id))
			$str =  mysql_real_escape_string($str, $this->EE->db->conn_id);
		elseif (function_exists('mysql_escape_string'))
			$str = mysql_escape_string($str);
		else
			$str = addslashes($str);
		
		return $str;
	}
}