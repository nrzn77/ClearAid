package com.iut.clearaid;

import org.junit.jupiter.api.Test;
import java.sql.Connection;
import java.sql.DriverManager;

public class PostgresConnectionTest {
    @Test
    public void testConnection() throws Exception {
        String url = "jdbc:postgresql://localhost:5432/clear_aid";
        String username = "postgres";
        String password = "khanmahi100";
        
        try {
            Class.forName("org.postgresql.Driver");
            Connection conn = DriverManager.getConnection(url, username, password);
            System.out.println("Database connection successful!");
            conn.close();
        } catch (Exception e) {
            System.err.println("Database connection failed!");
            e.printStackTrace();
            throw e;
        }
    }
}