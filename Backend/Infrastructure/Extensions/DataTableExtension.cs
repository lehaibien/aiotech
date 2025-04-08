using System.Collections;
using System.Data;
using System.Reflection;
using Newtonsoft.Json;

namespace Infrastructure.Extensions;

public static class DataTableExtension
{
    /*public static IEnumerable<T> ToList<T>(this DataTable table) where T : class
    {
        var properties = typeof(T).GetProperties();
        var result = new List<T>();

        foreach (DataRow row in table.Rows)
        {
            var item = Activator.CreateInstance<T>();
            foreach (var property in properties)
            {
                if (property.PropertyType.GetTypeInfo().IsClass && property.PropertyType != typeof(string))
                {
                    continue;
                }
                if (row[property.Name] == DBNull.Value)
                {
                    property.SetValue(item, null);
                    continue;
                }
                property.SetValue(item, row[property.Name]);
            }
            result.Add(item);
        }
        return result;
    }*/
    
    public static List<T> ToList<T>(this DataTable tbl) where T : class
    {
        List<T> list = new List<T>();
        foreach(DataRow row in tbl.Rows)
        {
            list.Add(CreateItemFromRow<T>(row));
        }

        return list;
    }

    private static T CreateItemFromRow<T>(DataRow row) where T : class
    {
        T val = (T) Activator.CreateInstance(typeof(T));
        SetItemFromRow(val, row);
        return val;
    }

    private static void SetItemFromRow<T>(T item, DataRow row) where T : class
    {
        foreach(DataColumn column in row.Table.Columns)
        {
            PropertyInfo property = item.GetType().GetProperty(column.ColumnName);
            if (property is null || row[column] == DBNull.Value)
            {
                continue;
            }
            var propertyType = property.PropertyType;
            if (propertyType.IsGenericType && propertyType.GetGenericTypeDefinition() == typeof(List<>))
            {
                var rowData = row[column].ToString()?.Split(',');
                var genericArguments = propertyType.GetGenericArguments();
                Type innerType;
                if (genericArguments.Length > 0)
                {
                    innerType = genericArguments[0];
                    var data = new List<string>(rowData ?? []);
                    property.SetValue(item, data, null);
                }
            }
            else
            {
                property.SetValue(item, row[column], null);
            }
        }
    }
}