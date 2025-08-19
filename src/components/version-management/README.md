# Version Management System

This system provides version management capabilities for all tables in the application. It allows users to:
1. View previous versions of table data
2. Restore to previous versions (FS_Admin only)
3. Track changes with timestamps and user information

## Components

### TableVersionHistory
A dialog component that displays the version history for any table. Shows:
- Version number and timestamp
- User who made the changes
- Description of changes
- Number of records in each version
- Restore button (only visible to FS_Admin users)

### TableWithVersions
A wrapper component that adds version management to any existing table component. Features:
- Automatically saves versions before data changes
- Adds a "Versions" button in the header
- Handles version restoration
- Works with any table component

### withVersionManagement (HOC)
A Higher-Order Component that can wrap any existing table component to add version management functionality.

## Hooks

### useTableVersions
Manages version state for tables:
- `saveVersion(data, description)` - Save a new version
- `restoreVersion(version)` - Restore to a previous version
- `versions` - Array of all versions

## Usage Examples

### Using TableWithVersions wrapper:
```tsx
import TableWithVersions from '@/components/version-management/TableWithVersions';
import CountryTable from './CountryTable';

const CountrySection = () => {
  const [data, setData] = useState(initialData);
  
  return (
    <TableWithVersions
      tableName="Countries"
      data={data}
      onDataChange={setData}
      title="Countries"
      onAddNew={handleAddNew}
    >
      <CountryTable
        onEdit={handleEdit}
        onCopy={handleCopy}
        onRemove={handleRemove}
      />
    </TableWithVersions>
  );
};
```

### Using HOC pattern:
```tsx
import { withVersionManagement } from '@/components/version-management/withVersionManagement';
import CountryTable from './CountryTable';

const CountryTableWithVersions = withVersionManagement(CountryTable, 'Countries');

// Use CountryTableWithVersions instead of CountryTable
```

### Direct integration in DynamicTable:
The DynamicTable component has version management built-in and automatically saves versions when:
- Adding new rows
- Deleting rows
- Making significant changes

## Role-Based Access

- **All Users**: Can view version history
- **FS_Admin Only**: Can restore to previous versions

The system checks user roles using the `useAuth` hook and only shows restore buttons to authorized users.

## Version Storage

Versions are stored in memory during the session. For production use, consider:
1. Persisting versions to a database
2. Implementing version cleanup/archival
3. Adding more detailed change tracking
4. Implementing diff viewing between versions

## Integration with Existing Tables

Every table in the system should be wrapped with version management. This is automatically handled by:
1. Using TableWithVersions wrapper for section components
2. Built-in version management in DynamicTable
3. HOC pattern for custom implementations

All table operations that modify data should automatically save versions before making changes.