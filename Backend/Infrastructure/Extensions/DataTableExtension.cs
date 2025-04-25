using System.Data;
using System.Reflection;

namespace Infrastructure.Extensions;

public static class DataTableExtension
{
    /// <summary>
    /// Converts a <see cref="DataTable"/> to a list of objects of type <typeparamref name="T"/>.
    /// </summary>
    /// <typeparam name="T">The reference type to which each row will be mapped.</typeparam>
    /// <returns>A list of objects of type <typeparamref name="T"/> populated from the rows of the <see cref="DataTable"/>.</returns>
    public static List<T> ToList<T>(this DataTable tbl)
        where T : class
    {
        List<T> list = [];
        foreach (DataRow row in tbl.Rows)
        {
            list.Add(CreateItemFromRow<T>(row));
        }

        return list;
    }

    /// <summary>
    /// Creates an instance of type <typeparamref name="T"/> and populates its properties from the specified <see cref="DataRow"/>.
    /// </summary>
    /// <typeparam name="T">The reference type to instantiate and populate.</typeparam>
    /// <param name="row">The <see cref="DataRow"/> containing data for the object's properties.</param>
    /// <returns>A new instance of <typeparamref name="T"/> with properties set from the data row.</returns>
    private static T CreateItemFromRow<T>(DataRow row)
        where T : class
    {
        T val = (T)Activator.CreateInstance(typeof(T))!;
        SetItemFromRow(val, row);
        return val;
    }

    /// <summary>
    /// Populates the properties of an object from a DataRow, matching column names to property names.
    /// </summary>
    /// <typeparam name="T">The type of the object to populate.</typeparam>
    /// <param name="item">The object whose properties will be set.</param>
    /// <param name="row">The DataRow containing the data.</param>
    private static void SetItemFromRow<T>(T item, DataRow row)
        where T : class
    {
        foreach (DataColumn column in row.Table.Columns)
        {
            PropertyInfo property = item.GetType().GetProperty(column.ColumnName);
            if (property is null || row[column] == DBNull.Value)
            {
                continue;
            }
            var propertyType = property.PropertyType;
            if (
                propertyType.IsGenericType
                && propertyType.GetGenericTypeDefinition() == typeof(List<>)
            )
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
